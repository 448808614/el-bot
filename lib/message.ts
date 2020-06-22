import { MessageType } from "mirai-ts";
import { el, bot } from "../index";
import { Config } from "..";

/**
 * 是否监听发送者
 * @param {Object} sender
 */
function isListening(sender: MessageType.Sender, listen: Config.Listen) {
  const config = el.config;

  if (listen === "all") {
    return true;
  }

  // 监听 master
  if (listen === "master" && config.master.includes(sender.id)) {
    return true;
  }

  // 监听管理员
  if (listen === "admin" && config.admin.includes(sender.id)) {
    return true;
  }

  // 指定 QQ
  if (listen.friend && listen.friend.includes(sender.id)) {
    return true;
  }

  if (sender.group) {
    // 群
    if (
      listen === "group" ||
      (listen.group && listen.group.includes(sender.group.id))
    ) {
      return true;
    }
  } else {
    // 私聊
    if (listen === "friend") {
      return true;
    }
  }

  return false;
};

/**
 * 通过配置发送消息
 * @param {MessageChain} messageChain
 * @param {object} target
 */
function sendMessageByConfig(messageChain: string | MessageType.MessageChain, target: Config.Target) {
  const mirai = bot.mirai;

  if (target.friend) {
    target.friend.forEach((qq) => {
      mirai.api.sendFriendMessage(qq, messageChain);
    });
  }

  if (target.group) {
    target.group.forEach((qq) => {
      mirai.api.sendGroupMessage(qq, messageChain);
    });
  }
}

export {
  isListening,
  sendMessageByConfig,
};